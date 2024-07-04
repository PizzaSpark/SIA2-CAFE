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

export default function UserTable({ dataList, onEdit }) {

    if (!Array.isArray(dataList)) {
        return <div>No dataList available.</div>;
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
                    {dataList.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.role}</TableCell>
                            <TableCell>
                                {item.disabled ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onEdit(item)}
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
