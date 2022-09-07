import { Test, TestingModule } from "@nestjs/testing";
import { LiveContentsGateway } from "./live-contents.gateway";
import { LiveContentsService } from "./live-contents.service";

describe("LiveContentsGateway", () => {
  let gateway: LiveContentsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveContentsGateway, LiveContentsService],
    }).compile();

    gateway = module.get<LiveContentsGateway>(LiveContentsGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
