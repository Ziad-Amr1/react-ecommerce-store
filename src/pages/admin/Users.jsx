import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "@/api/axios"; 

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Users() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  // Add Admin form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch Users
   useEffect(() => {
    const fetchUsers = async() => {
      setIsLoading(true);

      try {
        const response = await api.get("/users/all");

        console.log("USERS RESPONSE:", response.data);
        console.log("USERS DATA:", response.data.users);

        setUsers(response.data.users);
      } catch (error) {
        console.error("USERS ERROR:", error);
      } finally {
        setIsLoading(false);
      }
    };
      fetchUsers();
    }, []);

  // Add Admin
  const handleAddAdmin = (event) => {
    event.preventDefault();

    console.log("ADD ADMIN FORM:", {
      username,
      email,
      password,
      confirmPassword,
    });
  };

  // Close Add Admin Dialog
  const handleCloseDialog = () => {
    setIsAddAdminOpen(false);

    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("users.title")}
          </h1>

          <p className="text-muted-foreground">
            Manage all users
          </p>
        </div>

        <Button onClick={() => setIsAddAdminOpen(true)}>
          <Plus size={18} />
          Add Admin
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border">

        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : (
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>

                  <TableCell>
                    {user.username}
                  </TableCell>

                  <TableCell>
                    {user.email}
                  </TableCell>

                  <TableCell>
                    <Badge>
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      View
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        )}

      </div>

      {/* Add Admin Dialog */}
      <Dialog
        open={isAddAdminOpen}
        onOpenChange={setIsAddAdminOpen}
      >
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              Add Admin
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleAddAdmin}
            className="space-y-4"
          >

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Username
              </Label>

              <Input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter username"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm password"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">

              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>

              <Button type="submit">
                Create Admin
              </Button>

            </div>

          </form>

        </DialogContent>
      </Dialog>
    
    </div>
  );
}
