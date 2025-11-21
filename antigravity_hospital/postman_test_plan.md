# Postman Test Planı

## Koleksiyon Yapısı
- **Departments**
    - GET /api/departments (Listeleme)
    - POST /api/departments (Ekleme)
    - GET /api/departments/:id (Detay)
    - PUT /api/departments/:id (Güncelleme)
    - DELETE /api/departments/:id (Silme)
- **Doctors**
    - ... (Benzer CRUD işlemleri)
- **Patients**
    - ...
- **Schedules**
    - ...
- **Appointments**
    - ...
- **Prescriptions**
    - ...

## Test Script Örneği (Tests sekmesi)
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

pm.test("Body matches string", function () {
    pm.expect(pm.response.text()).to.include("Kardiyoloji");
});
```

## Export Açıklaması
Postman koleksiyonu, tüm endpointleri ve örnek request body'lerini içerecek şekilde export edilmelidir. Environment değişkenleri (baseUrl: http://localhost:3000) kullanılmalıdır.
