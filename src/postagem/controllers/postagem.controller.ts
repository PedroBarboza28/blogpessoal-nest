import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PostagemService } from '../services/postagem.service';
import { Postagem } from '../entities/postagem.entity';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Postagem')
@UseGuards(JwtAuthGuard)
@Controller('/postagens')
@ApiBearerAuth()
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {}

  @Get()
     @HttpCode(HttpStatus.OK) // Http Status 200
     findAll(): Promise<Postagem[]>{
         return this.postagemService.findAll();
     }
    
     @Get('/:id')
     @HttpCode(HttpStatus.OK) // Http Status 200
     findById(@Param('id', ParseIntPipe) id: number): Promise<Postagem>{
         return this.postagemService.findById(id);
     }
  
     @Get('/titulo/:titulo')
     @HttpCode(HttpStatus.OK) // Http Status 200
     findByTitulo(@Param('titulo') titulo: string): Promise<Postagem[]>{
         return this.postagemService.findByTitulo(titulo);
     }

     @Post('/cadastrar')
     @HttpCode(HttpStatus.CREATED) // Http Status 201
     create(@Body() postagem: Postagem): Promise<Postagem> {
         return this.postagemService.create(postagem);
     }

     @Put('/atualizar')
     @HttpCode(HttpStatus.OK) // Http Status 200
     update(@Body() postagem: Postagem): Promise<Postagem> {
         return this.postagemService.update(postagem);
     }

     @Delete('/:id')
     @HttpCode(HttpStatus.NO_CONTENT) // Http Status 204
     delete(@Param('id', ParseIntPipe) id: number){
         return this.postagemService.delete(id);
     }
 
}
