import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createClient } from 'pexels';
import * as cloudinary from 'cloudinary';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles } from 'src/users/user.roles.enum';
import { UpdateImageDto } from './dto/update-image.dto';
import { CreateImageDto } from './dto/create-image.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(ImagesService.name);

  async generateImages(limit: number, user: any) {
    const data = await this.getRandomImages(limit, user);
    return { limit: limit, data: data };
  }

  /**
   * Creates a single image
   *
   * @param createImageDto
   * @param user - User object
   * @returns Image
   *
   */
  async create(createImageDto: CreateImageDto, user: any) {
    const { uri, owner } = createImageDto;

    // if the user is an admin and 'owner' is given a value, look for
    // the user using the given user ID (owner) then set it as the owner
    // of the image to be created
    if (user.roles[0] === UserRoles.ADMIN && owner !== undefined) {
      user = await this.userRepository.findOne({ where: { id: owner } });

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const image = new Image();
    image.uri = uri;
    image.user = user;
    await image.save();

    // remove the user object from the response
    delete image.user;

    return image;
  }

  /**
   * Gets a single image
   *
   * @param id - ID of the image
   * @param user - User object
   * @returns Image
   *
   */
  async findOne(id: number, user: any) {
    // The value of withDeleted is set by checking the role of the user
    // If the user role is ADMIN, it will get the image even if it is deleted
    // Else, it will throw a 404 error
    const image = await this.imageRepository.findOne({
      where: { id: id },
      relations: ['user'],
      withDeleted: user.roles[0] === UserRoles.ADMIN,
    });

    if (!image)
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);

    if (image.user.id !== user.id && user.roles[0] !== UserRoles.ADMIN)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    // Increase hits by 1
    image.hits += 1;
    await image.save();
    delete image.user;

    return image;
  }

  /**
   * Updates a single image
   *
   * @param id - ID of the image
   * @param updateImageDto
   * @param user - User object
   * @returns Image
   *
   */
  async update(id: number, updateImageDto: UpdateImageDto, user: any) {
    const image = await this.imageRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!image) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    if (image.user.id !== user.id && user.roles[0] !== UserRoles.ADMIN)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const { hits, uri } = updateImageDto;
    image.hits = +hits;
    image.uri = uri;
    await image.save();
    delete image.user;

    return image;
  }

  /**
   * Soft removes a single image
   *
   * @param id - ID of the image
   * @param user - User object
   * @returns object
   *
   */
  async delete(id: number, user: any) {
    const image = await this.imageRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!image) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    if (image.user.id !== user.id && user.roles[0] !== UserRoles.ADMIN)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    await image.softRemove();

    return { message: 'Image deleted' };
  }

  /**
   * Gets random image(s) from Pexels then uploads it to Cloudinary
   *
   * @param limit - Number of image(s) to get from Pexels, defaults to 5, maximum 10
   * @param user - User object
   * @returns Image[]
   *
   */
  private async getRandomImages(limit = 5, user) {
    limit = limit > 10 ? 10 : limit;

    const images = [] as any;
    const pexels = createClient(process.env.PEXELS_API_KEY);
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    for (let i = 0; i < limit; i++) {
      try {
        const randomPhoto = (await pexels.photos.random()) as any;

        // create a public ID to use on cloudinary
        // get the 'alt' value from pexels, convert it to lower case and replace the whitespace
        // with underscore and append the id
        const publicId = `${randomPhoto.alt
          .toLowerCase()
          .replaceAll(' ', '_')}_${randomPhoto.id}`;

        // upload the image to cloudinary using the URL from pexels
        // we use the 'large' version of the photo instead of the original version
        // to avoid upload limits
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(
          randomPhoto.src.large,
          { public_id: publicId },
        );

        const image = new Image();
        image.uri = cloudinaryResponse.secure_url;
        image.user = user;
        await image.save();
        delete image.user;
        images.push(image);
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException();
      }
    }

    return images;
  }
}
