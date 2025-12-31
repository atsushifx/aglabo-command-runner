// src: shared/types/os2shell.types.ts
// @(#) : Type definitions for os2shell module
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Operating System Types for os2shell
 *
 * @remarks
 * Defines the operating systems supported by the os2shell module.
 * Maps platform types to their corresponding shell configurations.
 *
 * @example
 * ```typescript
 * import { AGTOSType } from '@aglabo/command-runner/types';
 *
 * const os = AGTOSType.Windows;
 * ```
 */
export enum AGTOSType {
  Windows = 'windows',
  macOS = 'macos',
  Linux = 'linux',
}

/**
 * Shell Types for os2shell
 *
 * @remarks
 * Defines the shell environments supported by the os2shell module.
 * Each shell type corresponds to a specific command shell environment.
 *
 * @example
 * ```typescript
 * import { AGTShellType } from '@aglabo/command-runner/types';
 *
 * const shell = AGTShellType.PowerShell;
 * ```
 */
export enum AGTShellType {
  PowerShell = 'pwsh.exe',
  Zsh = '/bin/zsh',
  Bash = '/bin/bash',
}

/**
 * OS to Shell Mapping
 *
 * @remarks
 * Maps operating system types to their corresponding default shell types.
 * This constant defines the relationship between platforms and shells
 * supported by the os2shell module.
 *
 * @example
 * ```typescript
 * import { AG_OS_TO_SHELL_MAP } from '@aglabo/command-runner/types';
 *
 * const defaultShell = AG_OS_TO_SHELL_MAP[AGTOSType.Windows];
 * ```
 */
export const AG_OS_TO_SHELL_MAP = {
  [AGTOSType.Windows]: AGTShellType.PowerShell,
  [AGTOSType.macOS]: AGTShellType.Zsh,
  [AGTOSType.Linux]: AGTShellType.Bash,
};
