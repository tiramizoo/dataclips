Dataclips::Engine.routes.draw do
  mount Dataclips::Engine, at: '/dataclips', as: :dataclips
  resources :insights, only: [:show] do
    get :data, on: :member
  end
end
