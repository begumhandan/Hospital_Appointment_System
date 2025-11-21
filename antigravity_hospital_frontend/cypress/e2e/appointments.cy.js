describe('Appointment System E2E', () => {
    beforeEach(() => {
        // Mock Data
        const doctors = [
            { id: 1, first_name: 'Ali', last_name: 'Yılmaz', department: { name: 'Kardiyoloji' } },
            { id: 2, first_name: 'Ayşe', last_name: 'Demir', department: { name: 'Nöroloji' } },
            { id: 3, first_name: 'Mehmet', last_name: 'Öztürk', department: { name: 'Dahiliye' } },
            { id: 4, first_name: 'Fatma', last_name: 'Kaya', department: { name: 'Ortopedi' } },
            { id: 5, first_name: 'Mustafa', last_name: 'Çelik', department: { name: 'Göz Hastalıkları' } }
        ];
        const patients = [
            { id: 1, first_name: 'Mehmet', last_name: 'Kaya', phone: '5551234567' },
            { id: 2, first_name: 'Zeynep', last_name: 'Çelik', phone: '5559876543' },
            { id: 3, first_name: 'Ahmet', last_name: 'Yıldız', phone: '5551112233' },
            { id: 4, first_name: 'Elif', last_name: 'Demir', phone: '5554445566' },
            { id: 5, first_name: 'Can', last_name: 'Polat', phone: '5557778899' }
        ];
        const appointments = [
            {
                id: 1,
                doctor_id: 1,
                patient_id: 1,
                appointment_date: '2023-12-25T10:00:00.000Z',
                status: 'Bekliyor',
                doctor: doctors[0],
                patient: patients[0]
            },
            {
                id: 3,
                doctor_id: 2,
                patient_id: 2,
                appointment_date: '2023-12-26T14:30:00.000Z',
                status: 'Onaylandı',
                doctor: doctors[1],
                patient: patients[1]
            },
            {
                id: 4,
                doctor_id: 3,
                patient_id: 3,
                appointment_date: '2023-12-27T09:15:00.000Z',
                status: 'Tamamlandı',
                doctor: doctors[2],
                patient: patients[2]
            },
            {
                id: 5,
                doctor_id: 4,
                patient_id: 4,
                appointment_date: '2023-12-28T11:00:00.000Z',
                status: 'İptal Edildi',
                doctor: doctors[3],
                patient: patients[3]
            }
        ];

        // API Mocking
        cy.intercept('GET', '**/api/doctors', { body: doctors }).as('getDoctors');
        cy.intercept('GET', '**/api/patients', { body: patients }).as('getPatients');
        cy.intercept('GET', '**/api/appointments', { body: appointments }).as('getAppointments');

        cy.intercept('POST', '**/api/appointments', (req) => {
            req.reply({
                statusCode: 201,
                body: {
                    id: 2,
                    doctor_id: req.body.doctor_id,
                    patient_id: req.body.patient_id,
                    appointment_date: req.body.appointment_date,
                    status: 'Bekliyor',
                    doctor: doctors[0],
                    patient: patients[0]
                }
            });
        }).as('createAppointment');

        cy.intercept('GET', '**/api/appointments/1', {
            body: appointments[0]
        }).as('getAppointmentDetail');

        cy.intercept('DELETE', '**/api/appointments/1', {
            statusCode: 204
        }).as('deleteAppointment');

        cy.visit('/');
        cy.wait(2000); // Açılış beklemesi
    });

    it('should list appointments', () => {
        cy.wait('@getAppointments');
        cy.wait(2000); // Listeyi incele
        cy.get('[data-cy="appointment-card"]').should('have.length', 4);
        cy.contains('Mehmet Kaya').should('be.visible');
        cy.wait(2000); // Sonuç beklemesi
    });

    it('should create a new appointment', () => {
        cy.wait(2000);
        cy.contains('Yeni Randevu').click();
        cy.wait(2000); // Sayfa geçişi
        cy.url().should('include', '/new');

        cy.wait(['@getDoctors', '@getPatients']);
        cy.wait(2000); // Formu incele

        cy.get('[data-cy="doctor-select"]').select(1);
        cy.wait(2000); // Doktor seçimi
        cy.get('[data-cy="patient-select"]').select(1);
        cy.wait(2000); // Hasta seçimi

        const now = new Date();
        now.setDate(now.getDate() + 1);
        const dateStr = now.toISOString().slice(0, 16);
        cy.get('[data-cy="date-input"]').type(dateStr);
        cy.wait(2000); // Tarih girişi

        cy.get('[data-cy="submit-btn"]').click();

        cy.wait('@createAppointment');
        cy.wait(2000);
        cy.url().should('eq', 'http://localhost:5173/');

        // Mock listede yeni eleman dönmeyeceği için (statik mock), 
        // yönlendirme sonrası tekrar getAppointments çağrılır.
        // Testin bu aşaması mock ile tam simüle edilemeyebilir ama video için yeterli.
        cy.wait('@getAppointments');
        cy.wait(3000); // Yeni listeyi incele
    });

    it('should view appointment details', () => {
        cy.wait('@getAppointments');
        cy.wait(2000);
        cy.get('[data-cy="view-btn"]').first().click();
        cy.wait('@getAppointmentDetail');
        cy.wait(2000); // Detay sayfası yüklenmesi
        cy.get('[data-cy="appointment-detail"]').should('be.visible');
        cy.contains('Randevu Detayı').should('be.visible');
        cy.contains('Kardiyoloji').should('be.visible');
        cy.wait(4000); // Detayları incele
    });

    it('should delete an appointment', () => {
        cy.wait('@getAppointments');
        cy.wait(2000);
        cy.get('[data-cy="delete-btn"]').first().click();
        cy.wait('@deleteAppointment');
        cy.wait('@getAppointments');
        cy.wait(3000); // Silme sonrası listeyi incele
    });
});
