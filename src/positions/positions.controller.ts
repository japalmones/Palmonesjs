import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
    constructor(private PositionsService: PositionsService) {}

    //Get all user (protected)
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return this.PositionsService.getAll();
    }
    
    //Get single user by id (protected)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.PositionsService.findById(+id);
    }
    
    //Create user (open - for demo)
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() body: { position_code: string; position_name: string; },
    @Req() req: Request
    ) {
    const userId = (req as any).user.userId;
    return this.PositionsService.createPosition(
      body.position_code,
      body.position_name,
      userId
    );
}

    //Update user (protected)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: {position_code?: string; position_name?: string}) {
        return this.PositionsService.updatePosition(+id, body);
    }

    //Delete user (protected)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.PositionsService.deletePosition(+id);
    }
}