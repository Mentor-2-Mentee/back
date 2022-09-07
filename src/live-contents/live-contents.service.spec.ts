import { Test, TestingModule } from "@nestjs/testing";
import { LiveContentsService } from "./live-contents.service";

describe("LiveContentsService", () => {
  let service: LiveContentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveContentsService],
    }).compile();

    service = module.get<LiveContentsService>(LiveContentsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
