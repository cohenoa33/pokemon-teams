require 'faker'

class PokemonsController < ApplicationController
  def create
    if pokemon_params[:trainer_id].nil?
      render json: { error: 'Trainer not found' }, status: 404
    else
      default = {}

      if Trainer.find(pokemon_params[:trainer_id]).pokemons.count < 6
        default[:nickname] = Faker::Name.first_name if pokemon_params[:nickname].nil?

        default[:species] = Faker::Games::Pokemon.name if pokemon_params[:species].nil?

        @pokemon = Pokemon.create(pokemon_params.merge(default))
        render json: @pokemon, status: 201
      else
        render json: { error: 'Party is Full!' }, status: 403
      end
    end
  end

  def destroy
    @pokemon = Pokemon.find(params[:id])
    if @pokemon.nil?
      render json: { error: 'Pokemon not Found!' }, status: 404
    else
      @pokemon.destroy
      render json: @pokemon
    end
  end

  private

  def pokemon_params
    params.require(:pokemon).permit(:nickname, :species, :trainer_id)
  end
end
