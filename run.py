import subprocess
import sys
import os

if __name__ == "__main__":
    # Activate virtual env programmatically and run uvicorn
    base_dir = os.path.dirname(os.path.abspath(__file__))
    python_path = os.path.join(base_dir, "venv", "Scripts", "python.exe")
    
    if not os.path.exists(python_path):
        python_path = "python"  # Fallback to system python
        
    print("Starting FlowGuide Backend server on http://localhost:8000...")
    try:
        subprocess.run([python_path, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"], cwd=base_dir)
    except KeyboardInterrupt:
        print("\nStopping backend server.")
