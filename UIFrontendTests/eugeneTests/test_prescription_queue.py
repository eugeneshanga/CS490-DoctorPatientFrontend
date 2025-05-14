# UIFrontendTests/eugeneTests/test_prescription_queue.py
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_fill_first_prescription_if_exists(login_as_pharmacy):
    driver = login_as_pharmacy   # already logged‐in browser
    # 1) switch to the queue tab
    driver.find_element(By.XPATH, "//button[text()='Prescription Queue']").click()

    # 2) wait for either an “appointment-card” or the “No pending prescriptions.” message
    WebDriverWait(driver, 5).until(
        EC.any_of(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".appointment-card")),
            EC.presence_of_element_located((By.XPATH, "//p[text()='No pending prescriptions.']"))
        )
    )

    # 3) if there are no cards, skip
    cards = driver.find_elements(By.CSS_SELECTOR, ".appointment-card")
    if not cards:
        pytest.skip("No pending prescriptions in the queue.")

    # 4) otherwise click the first “Mark as Filled”
    cards[0].find_element(By.CSS_SELECTOR, ".start-appointment-button").click()

    # 5) and wait until the queue shows empty
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//p[text()='No pending prescriptions.']"))
    )
    # sanity check
    assert driver.find_element(By.XPATH, "//p[text()='No pending prescriptions.']"), \
        "Expected no pending prescriptions after filling one"
