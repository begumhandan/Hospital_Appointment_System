class Api::AppointmentsController < ApplicationController
  before_action :set_appointment, only: %i[ show update destroy ]

  # GET /api/appointments
  def index
    @appointments = Appointment.all
    render json: @appointments, include: [:doctor, :patient]
  end

  # GET /api/appointments/1
  def show
    render json: @appointment, include: [:doctor, :patient, :prescription]
  end

  # POST /api/appointments
  def create
    @appointment = Appointment.new(appointment_params)

    if @appointment.save
      render json: @appointment, status: :created, location: api_appointment_url(@appointment)
    else
      render json: @appointment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/appointments/1
  def update
    if @appointment.update(appointment_params)
      render json: @appointment
    else
      render json: @appointment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/appointments/1
  def destroy
    @appointment.destroy
  end

  private
    def set_appointment
      @appointment = Appointment.find(params[:id])
    end

    def appointment_params
      params.require(:appointment).permit(:doctor_id, :patient_id, :appointment_date, :status)
    end
end
