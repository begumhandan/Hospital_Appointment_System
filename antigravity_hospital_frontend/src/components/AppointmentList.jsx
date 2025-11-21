import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const deleteAppointment = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:3000/api/appointments/${id}`);
                fetchAppointments();
            } catch (error) {
                console.error('Error deleting appointment:', error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Randevu Listesi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300" data-cy="appointment-card">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">{appointment.patient?.first_name} {appointment.patient?.last_name}</h3>
                                <p className="text-sm text-gray-500">Hasta</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${appointment.status === 'Onaylandı' ? 'bg-green-100 text-green-800' :
                                    appointment.status === 'İptal' ? 'bg-red-100 text-red-800' :
                                        appointment.status === 'Tamamlandı' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                }`}>
                                {appointment.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <p className="text-gray-700 flex items-center">
                                <span className="font-medium mr-2">Doktor:</span>
                                {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                            </p>
                            <p className="text-gray-700 flex items-center">
                                <span className="font-medium mr-2">Tarih:</span>
                                {new Date(appointment.appointment_date).toLocaleString('tr-TR')}
                            </p>
                        </div>

                        <div className="flex space-x-3 pt-4 border-t border-gray-100">
                            <Link to={`/appointments/${appointment.id}`} className="flex-1 text-center bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors" data-cy="view-btn">Detay</Link>
                            <Link to={`/appointments/${appointment.id}/edit`} className="flex-1 text-center bg-yellow-50 text-yellow-600 px-3 py-2 rounded-lg hover:bg-yellow-100 transition-colors" data-cy="edit-btn">Düzenle</Link>
                            <button onClick={() => deleteAppointment(appointment.id)} className="flex-1 text-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors" data-cy="delete-btn">Sil</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AppointmentList;
