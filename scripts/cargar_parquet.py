import pandas as pd
from pyspark.sql import SparkSession

# Inicializar Spark
spark = SparkSession.builder \
    .appName("Cargar Parquet") \
    .getOrCreate()

def cargar_parquet_como_tabla(ruta_archivo, nombre_tabla):
    """
    Carga un archivo Parquet como tabla en la base de datos
    
    Args:
        ruta_archivo: Ruta al archivo Parquet
        nombre_tabla: Nombre para la tabla en la base de datos
    """
    # Leer archivo Parquet
    df = spark.read.parquet(ruta_archivo)
    
    # Registrar como tabla temporal
    df.createOrReplaceTempView(nombre_tabla)
    
    print(f"Archivo {ruta_archivo} cargado como tabla '{nombre_tabla}'")

# Ejemplo de uso
ruta = "datos/ejemplo.parquet"
cargar_parquet_como_tabla(ruta, "tabla_ejemplo")

# Verificar tabla creada
spark.sql("SELECT * FROM tabla_ejemplo LIMIT 5").show()