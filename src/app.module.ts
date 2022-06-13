import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LiveRoomsModule } from "./live-rooms/live-rooms.module";
import { LiveRoom } from "./live-rooms/entities/live-room.entity";
import { LiveChatModule } from "./live-chat/live-chat.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthorizeModule } from './authorize/authorize.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LiveRoomsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mariadb",
        host: configService.get<string>("DATABASE_HOST"),
        port: parseInt(configService.get<string>("DATABASE_PORT")),
        username: configService.get<string>("DATABASE_USER"),
        password: configService.get<string>("DATABASE_PASSWORD"),
        database: `liveroom`,
        entities: [LiveRoom],
        synchronize: true, //production에서는 쓰지말것
      }),
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: "live-chat",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            url: `redis://${configService.get<string>(
              "REDIS_HOST"
            )}:${configService.get<string>("REDIS_PORT")}`,
          },
        }),
      },
    ]),
    LiveChatModule,
    AuthorizeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
