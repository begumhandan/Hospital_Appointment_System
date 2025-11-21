class Api::SchedulesController < ApplicationController
  before_action :set_schedule, only: %i[ show update destroy ]

  # GET /api/schedules
  def index
    @schedules = Schedule.all
    render json: @schedules, include: :doctor
  end

  # GET /api/schedules/1
  def show
    render json: @schedule, include: :doctor
  end

  # POST /api/schedules
  def create
    @schedule = Schedule.new(schedule_params)

    if @schedule.save
      render json: @schedule, status: :created, location: api_schedule_url(@schedule)
    else
      render json: @schedule.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/schedules/1
  def update
    if @schedule.update(schedule_params)
      render json: @schedule
    else
      render json: @schedule.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/schedules/1
  def destroy
    @schedule.destroy
  end

  private
    def set_schedule
      @schedule = Schedule.find(params[:id])
    end

    def schedule_params
      params.require(:schedule).permit(:doctor_id, :day, :start_time, :end_time)
    end
end
