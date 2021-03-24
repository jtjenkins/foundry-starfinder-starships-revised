let toChat = (content, rollString) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
    if (rollString) {
        let roll = new Roll(rollString).roll();
        chatData = {
            ...chatData,
            flavor: "Piloting",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

let form = `
    <h3>Science Officer Actions</h3>
    <br/>
    <b>Primary Skill:</b> Computers
    <br/>
    <b>Alternate Skill:</b> Perception
    <br/>
    <b>Support Skills:</b> Computers, Any Science, Perception
    <br/><br/>
    Science Officer actions help gain valuable information.
    <br/>
    Your starship’s sensors have a listed range, and you take a -2 penalty per hex your target is beyond that range. Some actions also have an optional Sweep effect that allow you to scan multiple targets at once, with a penalty.
    <br/><br/>
    <form>
        <div class='form-group'>
            <label>Skill Modifier</label>
            <input type='number' name='modifier'></input>
        </div>
        <div class='form-group'>
            <label>Bonus</label>
            <input type='number' name='bonus' value=0></input>
        </div>
        <div class='form-group'>
            <label>Action</label>
            <select name='action' id='science-officer-action'>
                <option value='identify'>Identify</option>
                <option value='analyze-system'>Analyze System</option>
                <option value='target-system'>Target System</option>
                <option value='update-status'>Update Status</option>
                <option value='activate-module'>Activate ECM Module</option>
                <option value='intercept-comms'>Intercept Comms</option>
                <option value='encrypt-comms'>Encrypt Comms</option>
                <option value='lock-on'>Lock On</option>
                <option value='overload-sensors'>Overload Sensors</option>
            </select>
        </div>
    </form>
    <br/>
    <table width='100%'>
        <tr>
            <th>Action</th>
            <th>DC</th>
            <th>PCU</th>
            <th>Effect</th>
        </tr>
        <tr>
            <td style="text-align:center">Identify</td>
            <td style="text-align:center">TL</td>
            <td style="text-align:center">1</td>
            <td style="text-align:center">Learn basic information about the target</td>
        </tr>
        <tr>
            <td style="text-align:center">Analyze System</td>
            <td style="text-align:center">TL</td>
            <td style="text-align:center">1</td>
            <td style="text-align:center">Learn detailed information about one of an Identified Target’s systems</td>
        </tr>
        <tr>
            <td style="text-align:center">Target System</td>
            <td style="text-align:center">TL</td>
            <td style="text-align:center">2</td>
            <td style="text-align:center">Next Critical Effect caused by your ship’s weapons targets an Analyzed System</td>
        </tr>
        <tr>
            <td style="text-align:center">Update Status</td>
            <td style="text-align:center">TL - 4</td>
            <td style="text-align:center">1</td>
            <td style="text-align:center">Refresh data on a target’s analyzed systems</td>
        </tr>
        <tr>
            <td style="text-align:center">Activate ECM Module</td>
            <td style="text-align:center">TL</td>
            <td style="text-align:center">Varies</td>
            <td style="text-align:center">Use one of your ship’s ECM module weapons</td>
        </tr>
        <tr>
            <td style="text-align:center">Intercept Comms</td>
            <td style="text-align:center">TL + 4</td>
            <td style="text-align:center">4</td>
            <td style="text-align:center">Listen in on a target’s outgoing communications</td>
        </tr>
        <tr>
            <td style="text-align:center">Encrypt Comms</td>
            <td style="text-align:center">25</td>
            <td style="text-align:center">0</td>
            <td style="text-align:center">Stop attempts to listen in on your outgoing communications</td>
        </tr>
        <tr>
            <td style="text-align:center">Lock On</td>
            <td style="text-align:center">TL + 8</td>
            <td style="text-align:center">6</td>
            <td style="text-align:center">Target a system and increase next attack damage by 1½</td>
        </tr>
        <tr>
            <td style="text-align:center">Overload Sensors</td>
            <td style="text-align:center">TL + 10</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center">Disable opponent’s Sensors checks and wipe out their analyzed data</td>
        </tr>
    </table>
    <br/>
`

let roll = (html) => {
    var mod = html.find('[name="modifier"]')[0].value
    var bonus = html.find('[name="bonus"]')[0].value
    var action = html.find('[name="action"]')[0].value
    // time to roll
    var roll = new Roll(`d20 + @mod + @bonus`,{mod:mod,bonus:bonus}).roll();
    // determine the action
    console.log(action)
    var type, message = ""
    switch (action){
        case "identify":
            type = "Identify"
            message = `
            You perform a preliminary scan to identify a target. Choose a target that is not already an Identified Target, then roll a Sensors check.
            <br/><br/>
            <b>Sweep:</b> You can attempt to Identify multiple targets at once. Roll one Sensors check, taking a cumulative -2 penalty for each target beyond the first, and then compare the result to each target’s TL.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL
            <br/><br/>
            <b>Success:</b> You learn basic information about the target, including: manufacturer, model, size, and any additional registration data provided by the ship’s registration box (see below). The target is now considered an Identified Target.
            <br/><br/>
            <b>Failure:</b> Images and other data about the target are blurry or inconclusive. You fail to learn additional information, and the target is not considered an Identified Target.
            `
            break
        case "analyze-system":
            type = "Analyze System"
            message = `
            You perform a deep scan on a target, attempting to analyze the details of one of their systems. Choose an Identified Target to scan, a system to analyze, and then roll a Sensors check. The possible systems are: Defenses, Life Support, Sensors, Weapons, Engines, Power Core, and Expansion Bays.
            <br/><br/>
            <b>Sweep:</b> You can attempt to analyze multiple systems at once. Roll one Sensors check, taking a -2 penalty for each targeted system beyond the first.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL
            <br/><br/>
            <b>Success (Defenses):</b> You learn the target’s AC, TL, shield rating, shield status, current and max Shield Points (SP), and current and max Hull Points (HP). Their defenses are now an Analyzed System.
            <b>Success (Life Support):</b> You learn the status of their life support system, and an estimate of the total number of living creatures of size Small or larger on board. Their life support is now an Analyzed System.
            <b>Success (Sensors):</b> You learn the target’s sensor status, range, and bonus modifier. Their sensors are now an Analyzed System.
            <b>Success (Weapon):</b> You learn the total number of weapons equipped to the target, as well as details about one specific weapon. You can choose to learn about a specific unanalyzed weapon you are aware of (such as “the one they just hit us with”), or provide some other criteria for priority (such as “the one that deals the most damage”). If no conditions are specified, you will learn about the next unanalyzed weapon in the order listed in the target’s stat block. Details of the weapon include its range, damage, and current status. The specific weapon you gain details about is now an Analyzed System.
            <b>Success (Engines):</b> You learn the target’s speed and engine status. Their engines are now an Analyzed System.
            <b>Success (Power Core):</b> You learn the target’s current and max PCU, PCU regen rating, and power core status. Their power core is now an Analyzed System.
            <b>Success (Expansion Bay):</b> You learn the total number of expansion bays on the target and the current configuration and status of a single unanalyzed bay, chosen at random by the GM. The chosen expansion bay is now an Analyzed System.
            <br/><br/>
            <b>Failure:</b> Your analysis comes up short, and you gain no additional information.
            `
            break
        case "target-system":
            type = 'Target System'
            message = `
            <b>Requirements:</b> 1 rank in Computers
            <br/><br/>
            <b>Power Cost:</b> 2
            <br/><br/>
            You tweak your starship’s weapons settings to hone in on a specific system. Choose an Identified Target and one of its Analyzed Systems. Then, roll a Sensors check.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL
            <br/><br/>
            <b>Success:</b> The next time one of your starship’s weapons causes a random Critical Effect to occur on the target, it causes a Critical Effect on the chosen Analyzed System instead. This targeting automatically ends if you use the Target System action again (even if you fail), or if that system becomes Wrecked. You can also end the targeting at any point during your starship’s turn, without using an action.
            <br/><br/>
            <b>Failure:</b> You fail to find an exploitable weakness in the target system. Nothing happens.
            `
            break
        case "update-status":
            type = "Update Status"
            message = `
            <b>Power Cost: 1</b>
            <br/><br/>
            You refresh your data on a starship’s systems. Choose an Identified Target.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL - 4
            <br/><br/>
            <b>Success:</b> You automatically learn the current status of all of the target’s Analyzed Systems.
            <br/><br/>
            <b>Failure:</b> An error in your simulation model produces contradictory results. You gain no new information.
            `
            break
        case 'activate-module':
            type = "Activate ECM Module"
            message = `
            <b>Requirements:</b> 1 rank in Computers
            <br/><br/>
            <b>Power Cost:</b> Varies by weapon
            <br/><br/>
            You fire at a target using one of your starship’s ECM module weapons. Choose an ECM module weapon that has not been used this turn, then choose a target and roll a Sensors check. Use your sensors’ range as the range for this attack. You take a -2 penalty to this attack if the target has active shields.
            <br/><br/>
            <b>Special:</b> If the ECM module does not require a target (such as modules with the transposition property), this action is automatically a success.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL
            <br/><br/>
            <b>Success:</b> Your weapon activates successfully, potentially dealing damage and/or activating any special effects.
            <br/>
            <b>Critical Success:</b> If the weapon deals damage, it deals double damage instead.
            <br/><br/>
            <b>Failure:</b> You deal no damage to the target.
            `
            break
        case 'intercept-comms':
            type = 'Intercept Comms'
            message = `
            <b>Requirements:</b> 3 ranks in Computers
            <br/><br/>
            <b>Power Cost:</b> 4
            <br/><br/>
            You attempt to listen in on a starship’s communication broadcasts. Choose a target, then roll a Sensors check.
            <br/><br/>
            <b>Sweep:</b> You can attempt to intercept the communications of multiple targets at once. You roll one Sensors check, taking a cumulative -2 penalty for each target beyond the first, and then compare it to each target’s TL + 4.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL + 4
            <br/><br/>
            <b>Success:</b> Until the start of your ship’s next turn, you can hear and record any outgoing communications from the target. This does not allow you to hear internal ship communications between crew members. If the target succeeds at an Encrypt Comms action, you must roll a new check immediately.
            <br/><br/>
            <b>Ongoing:</b> At the start of your ship’s turn, you can use your action to keep listening in on all currently monitored comms channels. If you choose to do this, you do not need to reroll the check.
            <br/><br/>
            <b>Failure:</b> You fail to locate the correct frequencies or encryption keys and hear nothing but static. The target (or targets) are made aware that someone has attempted this action, but cannot identify the actor directly.
            `
            break
        case 'encrypt-comms':
            type = 'Encrypt Comms'
            message = `
            <b>Requirements:</b> 3 ranks in Computers
            <br/><br/>
            You prepare to broadcast encrypted communications from your starship, or modify your existing encryption methods. Roll a Sensors check.
            <br/><br/>
            <b>Sensors DC</b> = 25
            <br/><br/>
            <b>Success:</b> Anyone currently intercepting your outgoing comms must immediately roll and succeed at a new Sensors check (with the same DC as a standard Intercept Comms action) to continue listening. You are made aware of the number of actors that fail this check, but not their specific identities.
            <br/><br/>
            <b>Failure:</b> You mistakenly reuse an existing encryption key, leaving your comms vulnerable. Anyone currently intercepting your outgoing comms continues to do so without your knowledge.
            `
            break
        case 'lock-on':
            type = 'Lock On'
            message = `
            <b>Requirements:</b> 6 ranks in Computers
            <br/><br/>
            <b>PCU Cost:</b> 6
            <br/><br/>
            You attempt to target a system with extreme precision. Choose an Identified Target and one of its Analyzed Systems, then roll a Sensors check.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL + 8
            <br/><br/>
            <b>Success:</b> Apply the effects of a successful Target System action with the chosen Analyzed System. Additionally, the next attack your starship makes that damages the target this turn multiplies its damage by 1½ (rounded down, and after accounting for critical hits).
            <br/><br/>
            <b>Failure:</b> A dramatic miscalculation causes your starship’weapons to miss their marks. Until the end of the turn, alGunnery checks take a -4 penalty versus the target. 
            `
            break
        case 'overload-sensors':
            type = 'Overload Sensors'
            message = `
            <b>Requirements:</b> 12 ranks in Computers
            <br/><br/>
            <b>PCU Cost:</b> 10
            <br/><br/>
            You attempt to overload foes’ sensors with erratic signals, fake comms, and other erroneous data. Choose a target, then roll a Sensors check.
            <br/><br/>
            <b>Sweep:</b> You can attempt to scramble the sensors of multiple targets at once. You roll one Sensors check, taking a cumulative -2 penalty for each target beyond the first, and then compare it to each target’s TL + 10.
            <br/><br/>
            <b>Sensors DC</b> = Target’s TL + 10
            <br/><br/>
            <b>Success:</b> The target’s sensors are scrambled. They cannot take any Science Officer actions until the start of your next turn. Any of the target’s active or ongoing science officer action effects (Target Sensors, Lock On, Intercept Comms) are immediately lost. The target also loses knowledge of all Analyzed Systems of your ship (but you remain an Identified Target if you were previously identified by them).
            <br/><br/>
            <b>Failure:</b> Your attempts to scramble your foes’ sensors fail, and nothing happens.
            `
            break
    }
    

    toChat(`Rolling to ${type}!`, roll.result)
    toChat(message)

}
var applyChanges = false
let d = new Dialog({
title: "Roll Engineer Action",
content: form,
buttons: {
 one: {
  icon: '<i class="fas fa-dice-d20"></i>',
  label: "Roll",
  callback: () => applyChanges = true
 }
},
default: "one",
close: html => {
   if (applyChanges)
       roll(html)
}
});
d.render(true);