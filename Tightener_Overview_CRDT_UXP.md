# CRDT_UXP Overview

## Project Description
**CRDT_UXP** (Creative Developer Tools for UXP) is the UXP (Unified Extensibility Platform) counterpart to **CRDT_ES**. It provides a similar set of extended capabilities for Adobe's modern UXP-based applications (like Photoshop and InDesign).

Key features include:
- **Async Operations**: Many functions are asynchronous, aligning with UXP's modern JavaScript environment.
- **File System**: Enhanced file and directory access.
- **Cryptography**: Encryption and decryption utilities.
- **Licensing**: Integration with the **PluginInstaller**.

## Integration with Tightener
CRDT_UXP brings the power of Tightener to the modern Adobe plugin architecture.

- **Bridge**: It likely uses a native UXP hybrid plugin approach or a local server connection (via `TightenerGW`) to access system-level features provided by Tightener.
- **Consistency**: It aims to provide a consistent API surface for developers transitioning from ExtendScript to UXP.
