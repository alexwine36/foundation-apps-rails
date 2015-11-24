class CalendarsController < ApplicationController

  respond_to :json
  def index
    respond_with Calendar.all
  end

  def show
    respond_with Calendar.find(params[:id])
  end

  def create
    respond_with Calendar.create(calendar_params)
  end

  def update
    calendar = Calendar.find(params[:id])
    respond_to do |format|
      if calendar.update_attributes(calendar_params)
        format.json { render json: calendar }
      else
        format.json { render json: {"errors"=> calendar.errors}, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    calendar = Calendar.find(params[:id])
    calendar.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  def calendar_params
    params.require(:calendar).permit(:title, :content)
  end
end

