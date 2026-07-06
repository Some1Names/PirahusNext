import { AdmissionYearClientRepository } from "./repositories/admission-year.repository";
import { AdmissionYearService } from "./services/admission-year.service";
import { AuthClientRepository } from "./repositories/auth.repository";
import { AuthService } from "./services/auth.service";
import { MenteeClientRepository } from "./repositories/mentee.repository";
import { MenteeService } from "./services/mentee.service";
import { MentorClientRepository } from "./repositories/mentor.repository";
import { MentorService } from "./services/mentor.service";
import { HintClientRepository } from "./repositories/hint.repository";
import { HintService } from "./services/hint.service";
import { CosmeticClientRepository } from "./repositories/cosmetic.repository";
import { CosmeticService } from "./services/cosmetic.service";
import { ShopItemClientRepository } from "./repositories/shop-item.repository";
import { ShopItemService } from "./services/shop-item.service";
import { GiftClientRepository } from "./repositories/gift.repository";
import { GiftService } from "./services/gift.service";
import { ProfileClientRepository } from "./repositories/profile.repository";
import { ProfileService } from "./services/profile.service";
import { LeaderboardClientRepository } from "./repositories/leaderboard.repository";
import { LeaderboardService } from "./services/leaderboard.service";
import { MinigameClientRepository } from "./repositories/minigame.repository";
import { MinigameClientService } from "./services/minigame.service";

const admissionYearRepository = new AdmissionYearClientRepository();
const authRepository = new AuthClientRepository();
const menteeRepository = new MenteeClientRepository();
const mentorRepository = new MentorClientRepository();
const hintRepository = new HintClientRepository();
const cosmeticRepository = new CosmeticClientRepository();
const shopItemRepository = new ShopItemClientRepository();
const giftRepository = new GiftClientRepository();
const profileRepository = new ProfileClientRepository();

export const admissionYearService = new AdmissionYearService(
  admissionYearRepository,
);
export const authService = new AuthService(authRepository);
export const menteeService = new MenteeService(menteeRepository);
export const mentorService = new MentorService(mentorRepository);
export const hintService = new HintService(hintRepository);
export const cosmeticService = new CosmeticService(cosmeticRepository);
export const shopItemService = new ShopItemService(shopItemRepository);
export const giftService = new GiftService(giftRepository);
export const profileService = new ProfileService(profileRepository);
export const leaderboardService = new LeaderboardService(
  new LeaderboardClientRepository(),
);

export const minigameService = new MinigameClientService(
  new MinigameClientRepository(),
);
