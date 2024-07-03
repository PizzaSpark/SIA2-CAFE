import { React, useState, useEffect } from "react";

export default function UserForm({ open, onClose, onSubmit, userToEdit }) {
    const initialFormData = {
        email: "",
        password: "",
        name: "",
        role: "",
        disabled: false,
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData(initialFormData);
        }
    }, [userToEdit]);

    useEffect(() => {
        if (!open) {
            setFormData(initialFormData);
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div>
            <div className="uwu">hi</div>
        </div>
    );
}
