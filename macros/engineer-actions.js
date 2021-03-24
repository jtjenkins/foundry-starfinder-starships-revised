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
    <h3>Engineer Actions</h3>
    <br/>
    <b>Primary Skills:</b> Engineering
    <br/>
    <b>Alternate Skills:</b> Physical Science, Life Science
    <br/>
    <b>Support Skills:</b> Engineering, Computers, Physical Science
    <br/><br/>
    Engineers use their actions to transfer power to various parts of the ship and to repair damaged systems.
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
            <select name='action' id='engineer-action'>
                <option value='divert'>Divert</option>
                <option value='maintain-levels'>Maintain Levels</option>
                <option value='restore-shields'>Restore Shields</option>
                <option value='patch-system'>Patch System</option>
                <option value='hold-it-together'>Hold It Together</option>
                <option value='emergency-repairs'>Emergency Repairs</option>
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
            <td style="text-align:center">Divert</td>
            <td style="text-align:center">13<br/>+4/ energized system</td>
            <td style="text-align:center">3 +1/sys</td>
            <td style="text-align:center">Energize a new system</td>
        </tr>
        <tr>
            <td style="text-align:center">Maintain Levels</td>
            <td style="text-align:center">10<br/>+4/energized system</td>
            <td style="text-align:center">1/sys</td>
            <td style="text-align:center">Keep systems energized</td>
        </tr>
        <tr>
            <td style="text-align:center">Restore Shields</td>
            <td style="text-align:center">restore DC (25%)<br/>+5 (50%)<br/>+10(75%)<br/>+15(100%)</td>
            <td style="text-align:center">5<br/>10<br/>20<br/>40</td>
            <td style="text-align:center">Restore a % of total SP</td>
        </tr>
        <tr>
            <td style="text-align:center">Patch Systems</td>
            <td style="text-align:center">10 (Glitch)<br/>20(Malfunc.)<br/>30(Wrecked)</td>
            <td style="text-align:center">0</td>
            <td style="text-align:center">Apply 1 Patch to a damaged system</td>
        </tr>
        <tr>
            <td style="text-align:center">Hold It Together</td>
            <td style="text-align:center">20<br/>+1/Glitch<br/>+3/Malfunc<br/>+6/Wrecked</td>
            <td style="text-align:center">0</td>
            <td style="text-align:center">Temporarily ignore critical system damage</td>
        </tr>
        <tr>
            <td style="text-align:center">Emergency Repairs</td>
            <td style="text-align:center">10<br/>+1/2 per HP</td>
            <td style="text-align:center">0</td>
            <td style="text-align:center">Restore HP to the Ship</td>
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
        case "divert":
            type = "Divert Power"
            message = `
            <b>PCU Cost:</b> 3 + 1 per active Energized System
            <br/><br/>
            You attempt to redirect power to one of your starship’s systems, increasing its output. Choose a system that is not currently Energized, then roll a Power Core check. The difficulty of this check increases based on the current number of Energized Systems.
            <br/><br/>
            The systems available for this action are: defenses, life support, sensors, specific direct-fire weapons, specific tracking weapons, the engines, and the power core
            <br/><br/>
            <b>Power Core DC</b> = 13 + 4 per active Energized System
            <br/><br/>
            <b>Success:</b> Your ship gains the success benefits of the chosen system as well as the success benefits of all currently Energized Systems. Each system can only receive these success benefits once per turn.
            <br/>
            <b>Success (Defenses):</b> You boost power output to your ship’s shields. Until the start of your ship’s next turn, double your shields’ protection rating. Defenses are now an Energized System.
            <br/>
            <b>Success (Life Support):</b> You transfer power to the life support systems to keep them functioning at full power. Until the start of your ship’s next turn, gain a +2 bonus to all Captain actions and treat the life support system as if they were not suffering from any Critical Effects. Life support is now an Energized System.
            <br/>
            <b>Success (Sensors):</b> You amplify the starship’s sensors, increasing their range and strength. Until the start of your ship’s next turn, your sensors’ range increases by 1 and provide an additional +2 bonus to Sensors checks. Sensors are now an Energized System.
            <br/>
            <b>Success (Specific Direct-Fire Weapon):</b> You overcharge a direct-fire weapon, making it more powerful but harder to aim. Until the start of your ship’s next turn, Gunnery checks with that weapon takes a -4 penalty to Gunnery checks and multiplies its damage by 1.25 (rounded down, and before accounting for critical hits). The chosen weapon is now an Energized System.
            <br/>
            <b>Success (Specific Tracking Weapon):</b> You overcharge the projectiles fired by a tracking weapon, increasing their speed and strength, but reducing their accuracy. Until the start of your ship’s next turn, new projectiles fired by that weapon take a permanent -4 penalty to Gunnery checks but gain a permanent +1 bonus to speed and multiply their damage by 1.25 (rounded down, and before accounting for critical hits). The chosen weapon is now an Energized System.
            <br/>
            <b>Success (Engines):</b> You increase the power output of the starship’s engines, increasing the speed of its thrusters while decreasing maneuverability. Until the start of your ship’s next turn, your ship’s speed increases by 1 and all Piloting checks take a -4 penalty. The engines are now an Energized System.
            <br/>
            <b>Success (Power Core):</b> You alter the power core to increase its power production. Your ship recovers an amount of PCU equal to the PCU recharge rate. The power core is now an Energized System.
            <br/><br/>
            <b>Failure:</b> You overload the ship’s circuits and cause damage to one of its systems. Choose one of the following: an Energized System, the system you attempted to energize with this action, or the Power Core. The chosen system suffers one Critical Effect, and all Energized Systems cease to be energized.
            `
            break
        case "maintain-levels":
            type = "Maintain Levels"
            message = `
            You attempt to maintain currently Energized Systems. Roll a Power Core check.
            <br/><br/>
            <b>Power Core DC</b> = 10 + 4 per active Energized System
            <br/><br/>
            <b>Success:</b> Your ship gains the benefits of a successful Divert action for all currently Energized Systems. Each  20 system can only receive these success benefits once per turn.
            <br/><br/>
            <b>Failure:</b> Same as the failure for the Divert action.`
            break
        case "restore-shields":
            type = 'Restore Shields'
            message = `
            <b>PCU Cost:</b> 5 for 25%, 10 for 50%, 20 for 75%, 40 for 100%
            <br/><br/>
            You temporarily redirect all power to the shields in an attempt to restore them. Choose the amount of SP you want to recover (25%, 50%, 75%, or 100%), then roll a Power Core check. The DC changes based on the restore DC of your shields (listed in its stats) and the amount of SP you are attempting to recover.
            <br/><br/>
            <b>Power Core DC</b> = Your Shields’ Restore DC (+0 for 25%, +5 for 50%, +10 for 75%, +15 for 100%)
            <br/><br/>
            <b>Success:</b> Your shields recover the chosen percentage of your maximum Shield Points.
            <br/><br/>
            <b>Failure:</b> Nothing happens
            `
            break
        case "patch-system":
            type = "Patch System"
            message = `
            You attempt to fix a damaged system on your starship. Choose a system with the Glitching, Malfunctioning, or Wrecked conditions, then roll a Repair check. The DC varies based on the current state of the chosen system.
            <br/><br/>
            <b>Repair DC (Glitching)</b> = 10
            <br/>
            <b>Repair DC (Malfunctioning)</b> = 20
            <br/>
            <b>Repair DC (Wrecked)</b> = 30
            <br/><br/>
            <b>Success:</b> You apply 1 Patch to the affected system. Once a system has a certain number of Patches applied to it (2 for Glitching, 3 for Malfunctioning, 4 for Wrecked), remove all Patches and improve its critical condition by 1 stage (Wrecked to Malfunctioning, Malfunctioning to Glitching, or Glitching to Normal). If a system that has at least one Patch would take a Critical Effect for any reason, remove all Patches instead of applying the Critical Effect.
            <br/><br/>
            <b>Failure:</b> Your attempted solution proves inadequate, and the system remains damaged. Nothing happens.
            `
            break
        case 'hold-it-together':
            type = "Hold It Together"
            message = `
            <b>Requirements:</b> 3 ranks in Engineering or Physical Science
            <br/><br/>
            You make a desperate attempt to keep damaged starship components in working order. Choose any number of damaged systems, then roll a Repair check. The difficulty of this check depends on the current state of the systems you chose.
            <br/><br/>
            <b>Repair DC</b> = 20 + 1 per Glitching system + 3 per Malfunctioning system + 6 per Wrecked system
            <br/><br/>
            <b>Success:</b> Until the start of your next turn, treat all of the chosen systems as if they were one stage better (treat Wrecked as Malfunctioning, Malfunctioning as Glitching, and Glitching as Normal) for the purposes of applying Critical Effect penalties to actions. If this action is performed multiple times in a turn on the same system, its effects stack. This effect does not alter the effects of Patch System or any active Patches. These temporary states also do not affect the Repair DC for Hold it Together.
            <br/><br/>
            <b>Failure:</b> Your attempts to keep systems functioning fall apart and set back existing repair efforts. Remove 1 Patch from each chosen system if any are present.
            `
            break
        case 'emergency-repairs':
            type = 'Emergency Repairs'
            message = `
            <b>Requirements:</b> 6 ranks in Engineering or Physical Science
            <br/><br/>
            Stepping into the airlock, you prepare to attempt the unthinkable: external hull repairs mid-combat. You must be able to access the exterior of the ship (typically using a combination of environmental protections, boot clamps, and cabling). You can only access the exterior of the ship if the ship is stationary (the last Pilot action taken was Idle) or if you were already on the exterior of the ship. Choose an amount of Hull Points to repair (up to a maximum of your base frame’s HP increment), then roll a Repairs check.
            <br/><br/>
            <b>Repairs DC</b> = 10 + ½ per HP to repair (rounded down)
            <br/><br/>
            <b>Success:</b> Your repairs are successful, and you restore the desired amount of HP to the ship, spending 20 UPB per HP repaired.
            <br/><br/>
            <b>Failure:</b> Your repairs don’t go as quickly as you hope. You do not restore any HP to the ship. Ongoing: Regardless of success or failure, you are considered to be on the outside of the starship until you use an action to return to the airlock. While outside the ship, you can only perform Emergency Repairs actions. Each time the starship takes hull damage while you are on the outside of the ship, you take half of the damage dealt (Reflex DC 20 to take no damage instead).
            <br/>
            At any point, you can choose to disconnect from the ship, causing yourself to float freely in space. A ship’s pilot can succeed at an Align action while in your space to pick you up.
            <br/>
            If your starship takes any Pilot action other than Idle while you are outside the ship, you must attempt a DC 25 Reflex save. On success, you stay attached to the ship, but take a -4 penalty to the next action you attempt this turn. On failure, you are forcibly disconnected from the ship.
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