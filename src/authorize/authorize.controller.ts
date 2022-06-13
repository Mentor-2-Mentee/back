import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { AuthorizeService } from "./authorize.service";
import { CreateAuthorizeDto } from "./dto/create-authorize.dto";
import { UpdateAuthorizeDto } from "./dto/update-authorize.dto";

interface AuthorizeByEmail {
  email: string;
  password: string;
}

@Controller("authorize")
export class AuthorizeController {
  constructor(private readonly authorizeService: AuthorizeService) {}

  @Post("/email")
  create(@Body() createAuthorizeDto: CreateAuthorizeDto) {
    console.log(createAuthorizeDto);
    return `authorize param get ${createAuthorizeDto.email} & ${createAuthorizeDto.password}`;
  }

  @Get()
  findAll() {
    return this.authorizeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.authorizeService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAuthorizeDto: UpdateAuthorizeDto
  ) {
    return this.authorizeService.update(+id, updateAuthorizeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.authorizeService.remove(+id);
  }
}
