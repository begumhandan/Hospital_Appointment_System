import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function AppointmentForm() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        doctor_id: '',
        patient_id: '',
        appointment_date: '',
        status: 'Bekliyor'
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    useEffect(() => {
        fetchDoctors();
        fetchPatients();
        if (isEditMode) {
            fetchAppointment();
        }
    }, [id]);

    const fetchDoctors = async () => {
        const response = await axios.get('http://localhost:3000/api/doctors');
        setDoctors(response.data);
    };

    const fetchPatients = async () => {
        const response = await axios.get('http://localhost:3000/api/patients');
        setPatients(response.data);
    };

    const fetchAppointment = async () => {
        const response = await axios.get(`http://localhost:3000/api/appointments/${id}`);
        const appt = response.data;
        setFormData({
            doctor_id: appt.doctor_id,
            patient_id: appt.patient_id,
            appointment_date: appt.appointment_date.slice(0, 16), // Format for datetime-local
            status: appt.status
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:3000/api/appointments/${id}`, formData);
            } else {
                await axios.post('http://localhost:3000/api/appointments', formData);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving appointment:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{isEditMode ? 'Randevu Düzenle' : 'Yeni Randevu Oluştur'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Doktor</label>
                        <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required data-cy="doctor-select">
                            <option value="">Doktor Seçiniz</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>{doc.first_name} {doc.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Hasta</label>
                        <select name="patient_id" value={formData.patient_id} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required data-cy="patient-select">
                            <option value="">Hasta Seçiniz</option>
                            {patients.map(pat => (
                                <option key={pat.id} value={pat.id}>{pat.first_name} {pat.last_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Tarih ve Saat</label>
                        <input type="datetime-local" name="appointment_date" value={formData.appointment_date} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required data-cy="date-input" />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Durum</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" data-cy="status-select">
                            <option value="Bekliyor">Bekliyor</option>
                            <option value="Onaylandı">Onaylandı</option>
                            <option value="İptal">İptal</option>
                            <option value="Tamamlandı">Tamamlandı</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={() => navigate('/')} className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">İptal</button>
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5" data-cy="submit-btn">
                        {isEditMode ? 'Değişiklikleri Kaydet' : 'Randevu Oluştur'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AppointmentForm;
