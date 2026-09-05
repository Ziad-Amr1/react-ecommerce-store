import React from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import api from "@/api/axios";

import{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// add admin dialog

export function AddAdminDialog({ isOpen , onClose ,onSuccess}){
    const {
        register,
        handleSubmit,
        formState:{ errors , isSubmitting},
        reset,
    } = useForm();

    const onSubmit = async (data)=>{
        try{
            await api.post("/users/add", data);
            toast.success("Admin has been added successfully")
            reset();
            onSuccess();
            onClose();
        } catch(error){
            toast.error(error.response?.data?.message|| "Failed to send data");
        }
    };
    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader> 
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username"> Username</Label>
                    <Input
                    id="username"
                    placeholder="username"
                    {...register("username" , {required:"Username is required"})}
                    />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Youremail</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    {...register("email" , {required:"Email is required" ,
                        pattern:{
                            Value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message:"Invalid email address",
                        },
                    })}
                    />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    {...register("password" ,{
                        required: "Password is required",
                        minlength:{value:6, message:"Password must be at least 6 characters"},
                    })}
                    />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
                <DialogFooter className="gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Save Admin"}
                    </Button>
                </DialogFooter>
            </form>  
        </DialogContent>
        </Dialog> 
    );
}
// delete conformation
export function DeleteConfirmDialog({ isOpen , onClose , user , onSuccess}){
    const [isDeleting , setIsDeleting] = React.useState(false);

    const handleDelete =async()=> {
        if (!user) return;
        setIsDeleting(true);
        try{
            await api.delete(`/users/${user.id}`);
            toast.success("User deleted successfully");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        }finally{
            setIsDeleting(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this user?{"  "}
                    <span className="font-bold text-foreground">{user?.name || user?.username}</span>
                </p>
                <DialogFooter className="gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
    // user details

    export function UserDetailsDialog({isOpen ,onClose ,user}) {
        if (!user) return null;

        return(
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-medium">{user.id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{user.name || user.username}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-medium">{user.role}</span>
                    </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }
