class Api::PrescriptionsController < ApplicationController
  before_action :set_prescription, only: %i[ show update destroy ]

  # GET /api/prescriptions
  def index
    @prescriptions = Prescription.all
    render json: @prescriptions, include: :appointment
  end

  # GET /api/prescriptions/1
  def show
    render json: @prescription, include: :appointment
  end

  # POST /api/prescriptions
  def create
    @prescription = Prescription.new(prescription_params)

    if @prescription.save
      render json: @prescription, status: :created, location: api_prescription_url(@prescription)
    else
      render json: @prescription.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/prescriptions/1
  def update
    if @prescription.update(prescription_params)
      render json: @prescription
    else
      render json: @prescription.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/prescriptions/1
  def destroy
    @prescription.destroy
  end

  private
    def set_prescription
      @prescription = Prescription.find(params[:id])
    end

    def prescription_params
      params.require(:prescription).permit(:appointment_id, :medicines, :notes)
    end
end
