import pandas as pd
from ydata_profiling import ProfileReport
import os

# Obtener la ruta raíz del proyecto correctamente
try:
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
except NameError:
    project_root = os.path.abspath(".")

# Definir rutas absolutas correctas
landing_zone = os.path.join(project_root, "data", "landing-zone")
quality_reports_path = os.path.join(project_root, "data", "raw-zone", "data_quality_reports")

# Verificar si las carpetas existen, si no, mostrar un error específico
if not os.path.exists(landing_zone):
    raise FileNotFoundError(f"La carpeta 'landing-zone' no existe en: {landing_zone}")
if not os.path.exists(quality_reports_path):
    os.makedirs(quality_reports_path, exist_ok=True)

# Procesar cada archivo CSV en la landing-zone
for file in os.listdir(landing_zone):
    if file.endswith('.csv'):
        file_path = os.path.join(landing_zone, file)

        # Cargar el archivo CSV
        df = pd.read_csv(file_path)

        # Generar perfil de datos
        profile = ProfileReport(df, title=f"Data Quality Report: {file}", explorative=True)

        # Guardar el informe como archivo HTML
        report_path = os.path.join(quality_reports_path, f"{file}_quality_report.html")
        profile.to_file(report_path)

        print(f"Informe de calidad generado: {report_path}")
