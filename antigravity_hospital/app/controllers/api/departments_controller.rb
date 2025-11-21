class Api::DepartmentsController < ApplicationController
  before_action :set_department, only: %i[ show update destroy ]

  # GET /api/departments
  def index
    @departments = Department.all
    render json: @departments
  end

  # GET /api/departments/1
  def show
    render json: @department
  end

  # POST /api/departments
  def create
    @department = Department.new(department_params)

    if @department.save
      render json: @department, status: :created, location: api_department_url(@department)
    else
      render json: @department.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/departments/1
  def update
    if @department.update(department_params)
      render json: @department
    else
      render json: @department.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/departments/1
  def destroy
    @department.destroy
  end

  private
    def set_department
      @department = Department.find(params[:id])
    end

    def department_params
      params.require(:department).permit(:name)
    end
end
