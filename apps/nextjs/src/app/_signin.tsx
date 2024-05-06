"use server";

import { auth, signIn } from "@acme/auth";

import { UserAvatar } from "./userAvatar.client";

export const AuthBtn = async () => {
  const session = await auth();

  if (!session)
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
    );

  return (
    <UserAvatar
      alt={session.user.name ?? ""}
      src={session.user.image ?? ""}
      fallback={
        session.user.name
          ?.split(" ")
          .map((namePart) => namePart.at(0)?.toUpperCase())
          .join("") ?? ""
      }
    />
  );
};
