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
            flavor: "Ship Critical Condition",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
}

var roll = new Roll(`d20`).roll();
toChat("It's a critical hit!", roll.result)
var total = roll.total
var message = ""
if (total <= 3)
{
    message = `
    <b>System</b>: Defenses
    <br/>
    <b>Affected Checks</b>: -
    <br/>
    <b>Glitching</b>: The ship loses Shield Points equal to half its protection rating each turn.
    <br/>
    <b>Malfunctioning</b>: As Glitching, but the ship's shields cannot be restored using the Restore Shields action.
    <br/>
    <b>Wrecked</b>: As Malfunctioning, but the ship’s shields stop functioning, and do not apply their damage reduction to incoming attacks.
    `
}
else if (total > 3 && total <=6)
{
    message = `
    <b>System</b>: Life Support
    <br/>
    <b>Affected Checks</b>: Leadership, Maintenance, Magic
    <br/>
    <b>Glitching</b>: -2
    <br/>
    <b>Malfunctioning</b>: -5
    <br/>
    <b>Wrecked</b>: -10
    `
}
else if (total > 6 && total <= 9)
{
    message = `
    <b>System</b>: Sensors
    <br/>
    <b>Affected Checks</b>: Sensors
    <br/>
    <b>Glitching</b>: -2
    <br/>
    <b>Malfunctioning</b>: -5 and Sensors range is reduced by 1
    <br/>
    <b>Wrecked</b>: -10 and Sensors range is reduced to 0 and cannot be increased
    `
}
else if (total > 9 && total <= 12)
{
    message = `
    <b>System</b>: Weapons (choose random weapon)
    <br/>
    <b>Affected Checks</b>: Gunnery
    <br/>
    <b>Glitching</b>: -2
    <br/>
    <b>Malfunctioning</b>: -5 and weapon's range is reduced by 1
    <br/>
    <b>Wrecked</b>: -10 and weapon's range is reduced to 0 and cannot be increased
    `
}
else if (total > 12 && total <= 15) 
{
    message = `
    <b>System</b>: Engine
    <br/>
    <b>Affected Checks</b>: Flight
    <br/>
    <b>Glitching</b>: -2
    <br/>
    <b>Malfunctioning</b>: -5 and ships's speed is reduced by 1 (minimum 1)
    <br/>
    <b>Wrecked</b>: -10 and ship's speed is reduced to 1 and cannot be increased. If the Power Core is Malfunctioning or Wrecked, speed is reduced to 0 instead.
    `
}
else if (total > 15 && total <= 18)
{
    message = `
    <b>System</b>: Power Core
    <br/>
    <b>Affected Checks</b>: Power Core
    <br/>
    <b>Glitching</b>: -2
    <br/>
    <b>Malfunctioning</b>: -5
    <br/>
    <b>Wrecked</b>: -10 <br/> Defenses, Sensors, and all weapons are treated as if they are Wrecked until the Power Core is repaired to Malfunctioning or better. All actions that use PCU automatically fail.
    `
}
else // a 19 or 20
{
    message = `
    <b>System</b>: Expansion Bays (choose random bay)
    <br/>
    <b>Affected Checks</b>: -
    <br/>
    <b>Glitching</b>: The affected expansion bay suffers minor cosmetic damage (flickering lights, sparking wires, etc.).
    <br/>
    <b>Malfunctioning</b>: The affected expansion bay no longer functions. Any actions or benefits (aside from storage) this bay provides are immediately ended and cannot resume until repaired.
    <br/>
    <b>Wrecked</b>: The affected expansion bay no longer functions. If this effect was caused by an attack that dealt damage, the contents of this bay (including items, creatures, etc.) are violently ejected from the ship.
    `
}

toChat(message)