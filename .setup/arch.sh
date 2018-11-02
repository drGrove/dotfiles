#!/bin/bash
pacman -Sy $(cat arch_programs.txt | xargs) 
