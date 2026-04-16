import logging
import os

log_folder = "logs"
os.makedirs(log_folder, exist_ok=True)

log_file = os.path.join(log_folder, "app.log")

logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def log_info(message):
    logging.info(message)

def log_error(message):
    logging.error(message)