import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigDatabaseService } from "./config/config.database.service";
import { ConfigModule } from "@nestjs/config";
import { RequestsModule } from "./tickets/request.module";

@Module({
  imports: [
    RequestsModule,
    TypeOrmModule.forRootAsync({ useClass: ConfigDatabaseService }),
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
