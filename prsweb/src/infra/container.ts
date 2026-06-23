import { AdmissionYearRepository } from "./repositories/admission-year.repository";
import { AdmissionYearService } from "../core/service/admission-year.service";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthService } from "../core/service/auth.service";
import { MenteeRepository } from "./repositories/mentee.repository";
import { MenteeService } from "../core/service/mentee.service";
import { MentorRepository } from "./repositories/mentor.repository";
import { MentorService } from "../core/service/mentor.service";
import { HintRepository } from "./repositories/hint.repository";
import { HintService } from "../core/service/hint.service";

const admissionYearRepository = new AdmissionYearRepository();
const authRepository = new AuthRepository();
const menteeRepository = new MenteeRepository();
const mentorRepository = new MentorRepository();
const hintRepository = new HintRepository();

export const admissionYearService = new AdmissionYearService(
  admissionYearRepository,
);
export const authService = new AuthService(authRepository);
export const menteeService = new MenteeService(menteeRepository);
export const mentorService = new MentorService(mentorRepository);
export const hintService = new HintService(hintRepository);
