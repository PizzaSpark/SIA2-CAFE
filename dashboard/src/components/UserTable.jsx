import { React, useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function UserTable({ users, onEdit }) {

    if (!Array.isArray(users)) {
        return <div>No users available.</div>;
      }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Disabled</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                {user.disabled ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onEdit(user)}
                                >
                                    <Edit />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
