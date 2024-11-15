import kagglehub
import os

# Descargar el dataset
path = kagglehub.dataset_download("rohanrao/air-quality-data-in-india")

# Definir la landing zone
landing_zone = "./data/landing-zone"
os.makedirs(landing_zone, exist_ok=True)

# Mover archivos a landing-zone
for file in os.listdir(path):
    os.rename(os.path.join(path, file), os.path.join(landing_zone, file))

print("Archivos movidos a landing-zone:", os.listdir(landing_zone))
