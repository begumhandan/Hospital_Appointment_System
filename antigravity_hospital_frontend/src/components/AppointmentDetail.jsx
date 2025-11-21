import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function AppointmentDetail() {
    const [appointment, setAppointment] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/appointments/${id}`);
            setAppointment(response.data);
        } catch (error) {
            console.error('Error fetching appointment:', error);
        }
    };

    if (!appointment) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md" data-cy="appointment-detail">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Randevu Detayı</h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${appointment.status === 'Onaylandı' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'İptal' ? 'bg-red-100 text-red-800' :
                            appointment.status === 'Tamamlandı' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                    }`}>
                    {appointment.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hasta Bilgileri</h3>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{appointment.patient?.first_name} {appointment.patient?.last_name}</p>
                        <p className="text-gray-600">{appointment.patient?.phone || 'Telefon yok'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tarih ve Saat</h3>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{new Date(appointment.appointment_date).toLocaleString('tr-TR')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Doktor Bilgileri</h3>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{appointment.doctor?.first_name} {appointment.doctor?.last_name}</p>
                        <p className="text-blue-600 font-medium">{appointment.doctor?.department?.name}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <Link to="/" className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 font-medium transition-colors">Listeye Dön</Link>
            </div>
        </div>
    );
}

export default AppointmentDetail;
