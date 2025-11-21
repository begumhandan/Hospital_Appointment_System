Rails.application.routes.draw do
  namespace :api do
    resources :departments
    resources :doctors
    resources :patients
    resources :schedules
    resources :appointments
    resources :prescriptions
  end
end
