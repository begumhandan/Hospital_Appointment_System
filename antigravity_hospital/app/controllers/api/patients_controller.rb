class Api::PatientsController < ApplicationController
  before_action :set_patient, only: %i[ show update destroy ]

  # GET /api/patients
  def index
    @patients = Patient.all
    render json: @patients
  end

  # GET /api/patients/1
  def show
    render json: @patient
  end

  # POST /api/patients
  def create
    @patient = Patient.new(patient_params)

    if @patient.save
      render json: @patient, status: :created, location: api_patient_url(@patient)
    else
      render json: @patient.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/patients/1
  def update
    if @patient.update(patient_params)
      render json: @patient
    else
      render json: @patient.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/patients/1
  def destroy
    @patient.destroy
  end

  private
    def set_patient
      @patient = Patient.find(params[:id])
    end

    def patient_params
      params.require(:patient).permit(:first_name, :last_name, :tc_number, :phone)
    end
end
