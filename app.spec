# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller spec file for Goat Farm Flask+React application.

This spec uses --onedir mode for better stability and faster startup on other systems.

Usage:
    pyinstaller app.spec

Output:
    - dist/app/ (directory containing the executable and all dependencies)
    - build/ (build files)
"""

import os
from PyInstaller.utils.hooks import collect_submodules, collect_data_files

# Build datas list - only include files that exist
datas_list = [
    ('static', 'static'),  # Include the entire static folder (frontend build + uploads)
]
if os.path.exists('goatfarm.db'):
    datas_list.append(('goatfarm.db', '.'))

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=datas_list,
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=None)

exe = EXE(
    pyz,
    a.scripts,
    [],
    name='app',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='app',
)

