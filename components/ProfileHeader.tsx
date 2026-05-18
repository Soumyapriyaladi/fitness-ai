"use client";

import { UserResource } from "@clerk/types";

const CornerElements = () => (
  <>
    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary" />
    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary" />
  </>
);

const ProfileHeader = ({ user }: { user: UserResource }) => {
  return (
    <div className="mb-10 relative backdrop-blur-sm border border-border p-6">
      <CornerElements />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          {user.imageUrl ? (
            <div className="relative w-24 h-24 overflow-hidden rounded-lg">
              <img
                src={user.imageUrl}
                alt={user.fullName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}

          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono">
            {user.fullName || "User"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user.emailAddresses[0]?.emailAddress}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              Member
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;