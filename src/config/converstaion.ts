import { db } from "./db";

const findCoverstaion = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        OR: [
          { AND: [{ memberOneId }, { memberTwoId }] },
          { AND: [{ memberOneId: memberTwoId }, { memberTwoId: memberOneId }] },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

const createConverstaion = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    // console.error("Error creating conversation:", error);
    return null;
  }
};

export default async function getOrCreateConverstaion( memberOneId: string, memberTwoId: string ) {
  let converstaion = await findCoverstaion(memberOneId, memberTwoId)
  if (!converstaion) {
    console.log("Conversation is not found, now creating one...");
    converstaion = await createConverstaion(memberOneId, memberTwoId);
    console.log("here is the result of created conversation", converstaion);
  }
  return converstaion;
}
