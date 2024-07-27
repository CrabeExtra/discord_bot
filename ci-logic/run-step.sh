#!/bin/bash
# wrapper for ci-reference functions to reduce having to import functions each step in workflow.
source ./ci-reference-functions.sh
run_step "$1" "$2"