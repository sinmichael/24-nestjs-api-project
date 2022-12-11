import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ACGuard, UseRoles } from 'nest-access-control';
import { CustomAuthGuard } from 'src/auth/custom-auth.guard';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @ApiOperation({ summary: 'Generate random images' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of images to be generated. Default 5, maximum 10.',
  })
  @UseGuards(CustomAuthGuard, ACGuard)
  @UseRoles({
    resource: 'image',
    action: 'create',
    possession: 'own',
  })
  generateImages(@Request() req, @Query() query: { limit: number }) {
    return this.imagesService.generateImages(query.limit, req.user);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a single image' })
  @UseGuards(CustomAuthGuard, ACGuard)
  @UseRoles({
    resource: 'image',
    action: 'create',
    possession: 'own',
  })
  create(@Body() createImageDto: CreateImageDto, @Request() req) {
    return this.imagesService.create(createImageDto, req.user);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a single image' })
  @UseGuards(CustomAuthGuard, ACGuard)
  @UseRoles({
    resource: 'image',
    action: 'read',
    possession: 'own',
  })
  findOne(@Request() req, @Param('id') id: number) {
    return this.imagesService.findOne(+id, req.user);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update the URI and number of hits of a single image',
  })
  @UseGuards(CustomAuthGuard, ACGuard)
  @UseRoles({
    resource: 'image',
    action: 'update',
    possession: 'own',
  })
  update(
    @Body() updateImageDto: UpdateImageDto,
    @Request() req,
    @Param('id') id: number,
  ) {
    return this.imagesService.update(+id, updateImageDto, req.user);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a single image',
  })
  @UseGuards(CustomAuthGuard, ACGuard)
  @UseRoles({
    resource: 'image',
    action: 'delete',
    possession: 'own',
  })
  delete(@Request() req, @Param('id') id: number) {
    return this.imagesService.delete(+id, req.user);
  }
}
