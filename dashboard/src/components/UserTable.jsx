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
    TablePagination, // Import TablePagination
} from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function UserTable({ dataList, onEdit }) {
    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Handle change page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle change rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0 when rows per page changes
    };

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
                    {dataList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item) => (
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
}