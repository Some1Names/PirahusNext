import { MentorWithRelations } from "@/src/repositories/mentor.repository";
import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

export function mapToDomainMentor(mentor: MentorWithRelations): IMentor {
  const mappedMentor: IMentor = {
    id: mentor.id,
    studentId: mentor.studentId,
    password: mentor.password,
    nickname: mentor.nickname,
    point: mentor.point,
    isAdmin: mentor.isAdmin,
    unlockedCosmetics: mentor.unlockedCosmetics,
    equippedEffect: mentor.equippedEffect,
    createdAt: mentor.createdAt,
    updatedAt: mentor.updatedAt,
    hints: mentor.hints,
    mentee: null,
  };

  if (mentor.mentee) {
    const mappedMentee: IMentee = {
      id: mentor.mentee.id,
      studentId: mentor.mentee.studentId,
      password: mentor.mentee.password,
      nickname: mentor.mentee.nickname,
      point: mentor.mentee.point,
      unlockedHintLevels: mentor.mentee.unlockedHintLevels,
      unlockedCosmetics: mentor.mentee.unlockedCosmetics,
      equippedEffect: mentor.mentee.equippedEffect,
      createdAt: mentor.mentee.createdAt,
      updatedAt: mentor.mentee.updatedAt,
      mentorId: mentor.id,
      mentor: null,
    };
    mappedMentor.mentee = mappedMentee;
  }

  return mappedMentor;
}
