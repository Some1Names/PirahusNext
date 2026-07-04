import { MenteeWithRelations } from "@/src/repositories/mentee.repository";
import { IMentee } from "@/src/core/domain/mentee";
import { IMentor } from "@/src/core/domain/mentor";

export function mapToDomainMentee(mentee: MenteeWithRelations): IMentee {
  if (!mentee.mentor) {
    throw new Error("Mentor is required");
  }

  const mappedMentor: IMentor = {
    id: mentee.mentor.id,
    studentId: mentee.mentor.studentId,
    nickname: mentee.mentor.nickname,
    point: mentee.mentor.point,
    isAdmin: mentee.mentor.isAdmin,
    unlockedCosmetics: mentee.mentor.unlockedCosmetics,
    equippedEffect: mentee.mentor.equippedEffect,
    createdAt: mentee.mentor.createdAt,
    updatedAt: mentee.mentor.updatedAt,
    hints: mentee.mentor.hints,
    mentee: null,
  };

  const mappedMentee: IMentee = {
    id: mentee.id,
    studentId: mentee.studentId,
    nickname: mentee.nickname,
    point: mentee.point,
    unlockedHintLevels: mentee.unlockedHintLevels,
    unlockedCosmetics: mentee.unlockedCosmetics,
    equippedEffect: mentee.equippedEffect,
    createdAt: mentee.createdAt,
    updatedAt: mentee.updatedAt,
    mentorId: mentee.mentorId,
    mentor: mappedMentor,
  };

  mappedMentor.mentee = mappedMentee;
  
  return mappedMentee;
}
