# some nice functions to reduce repeated aspects of workflow while maintaining extra functionality.

concatenate_commands() {
    local file=$1
    local concatenated_commands=""

    while IFS= read -r line; do
        concatenated_commands+="$line\n"
    done < "$file"

    echo -e "$concatenated_commands"
}

run_commands() {
    local ip=$1
    local file=$2

    local commands
    commands=$(concatenate_commands "$file")
    
    ssh -tt -o StrictHostKeyChecking=no "ubuntu@$ip"<<EOF
$commands
exit 0
EOF
}

run_step() {
    local ip=$1
    local config_file=$2
    run_commands "$ip" "$config_file"
}