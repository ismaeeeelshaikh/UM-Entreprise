import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback className="text-2xl">
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{session.user.name}</CardTitle>
                <CardDescription>{session.user.email}</CardDescription>
                <Badge
                  className="mt-2"
                  variant={
                    session.user.role === "ADMIN" ? "destructive" : "default"
                  }
                >
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="text-sm">{session.user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Account Type
                </p>
                <p className="text-sm">
                  {session.user.role === "ADMIN"
                    ? "Administrator"
                    : "Customer"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
