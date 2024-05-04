"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar"
import React from "react";

export const UserAvatar = ({ alt, src, fallback }: Pick<React.ComponentProps<typeof AvatarImage>, 'src' | 'alt'> & { fallback: string }) => {
  return (
    <Avatar>
      <AvatarImage alt={alt} src={src} />
      {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
    </Avatar>
  )
}
