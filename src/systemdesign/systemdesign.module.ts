import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemdesignService } from './systemdesign.service';
import { SystemdesignController } from './systemdesign.controller';
import { Systemdesign, SystemdesignSchema } from './entities/systemdesign.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Systemdesign.name, schema: SystemdesignSchema }])
  ],
  controllers: [SystemdesignController],
  providers: [SystemdesignService],
  exports: [SystemdesignService],
})
export class SystemdesignModule {}
